package kr.nerv.antop.model;

import java.util.Date;

public class ScoreModel {
	private int seq;
	private int grid;
	private String name;
	private Date cost;
	private Date created;
	private Date modified;
	// option
	private int rank;

	public ScoreModel() {

	}

	public ScoreModel(int grid, String name, Date cost) {
		this.grid = grid;
		this.name = name;
		this.cost = cost;
	}

	public int getSeq() {
		return seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public int getGrid() {
		return grid;
	}

	public void setGrid(int grid) {
		this.grid = grid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getCost() {
		return cost;
	}

	public void setCost(Date cost) {
		this.cost = cost;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public Date getModified() {
		return modified;
	}

	public void setModified(Date modified) {
		this.modified = modified;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((cost == null) ? 0 : cost.hashCode());
		result = prime * result + ((created == null) ? 0 : created.hashCode());
		result = prime * result + grid;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + seq;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ScoreModel other = (ScoreModel) obj;
		if (cost == null) {
			if (other.cost != null)
				return false;
		} else if (!cost.equals(other.cost))
			return false;
		if (created == null) {
			if (other.created != null)
				return false;
		} else if (!created.equals(other.created))
			return false;
		if (grid != other.grid)
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (seq != other.seq)
			return false;
		return true;
	}

}
