<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<json:object>
	<c:import url="../success.jsp" charEncoding="UTF-8" />
	<json:array name="data" var="score" items="${scores}">
		<json:object>
			<json:property name="seq" value="${score.seq}" />
			<json:property name="grid" value="${score.grid}" />
			<json:property name="name" value="${score.name}" />
			<json:property name="cost">
				<fmt:formatDate value="${score.cost}" pattern="H:mm:ss"/>
			</json:property>
			<json:property name="created" value="${score.created}" />
			<json:property name="modified" value="${score.modified}" />
		</json:object>
	</json:array>
</json:object>